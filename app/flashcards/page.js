'use client'

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc,getDoc,setDoc } from "firebase/firestore/lite"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Card, CardActionArea, CardContent, Container, Grid, Paper, Typography, Box, Button, AppBar, Toolbar } from "@mui/material"
import Link from "next/link"

export default function Flashcards(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
    

    useEffect(() => {
        async function getFlashcards(){
            if(!user) return
            const docRef = doc(collection(db,'users'), user.id )
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                console.log(collections)
                setFlashcards(collections)
            }else{
                await setDoc(docRef, {flashcards: []})
            }
        }

        getFlashcards()
        
    }, [user])

    if(!isLoaded || !isSignedIn){
        return <></> // this is nothing
    }

    const handleCardClick = (id) =>{
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="md">
            <Box sx={{
                mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Typography variant="h4" color="secondary" gutterBottom sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    My Flashcards
                </Typography>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{flexGrow:1}}>
                            <Link href="./" passHref style={{textDecoration: 'none', boxShadow: 'none', color: 'inherit'}}>Flashcard SaaS</Link>
                        </Typography>
                        <SignedOut>
                            <Button color="inherit" href="/sign-in">Login</Button>
                            <Button color="inherit" href="/sign-up">Sign Up</Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={3} sx={{
                    mt: 4,
                }}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs = {12} sm = {6} md = {4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => {
                                    handleCardClick(flashcard.name)
                                }}>
                                    <CardContent>
                                        <Typography variant ="h6">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid> 
                    ))}
                </Grid>
                <Box sx={{mt: 4, display: 'flex', justifyContent:'center'}}>
                    <Button variant="contained" color="primary" href="/generate">Generate More</Button>
                </Box>
            </Box>
        </Container>
    )
}