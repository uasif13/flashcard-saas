'use client'

import { db } from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore/lite"
import { useTheme } from '@mui/material/styles'

export default function Generate() {
    const theme = useTheme()
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState(null)
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        console.log("Flashcards state updated:", flashcards)
    }, [flashcards])

    const handleSubmit = async () => {
        try {
            setError(null)
            let response = await fetch('api/generate', {
                method: 'POST',
                headers: {  
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            })
            console.log("Response:", response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            if (data && Array.isArray(data)) {
                setFlashcards(data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setFlashcards([]);
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }


    //helper function to save our stuff
    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists.")
                return
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const columnRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(columnRef)
            batch.set(cardDocRef, flashcard)
        });

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Container maxWidth="md">
            <Box sx={{
                mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Typography variant="h4" color="secondary" gutterBottom sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4, width: '100%', backgroundColor: 'background.paper', borderRadius: '15px' }}>
                    <TextField 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        label="Enter text" 
                        fullWidth 
                        multiline 
                        rows={4} 
                        variant="outlined" 
                        sx={{ mb: 2, 
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'secondary.main',
                                },
                            },
                        }} 
                        InputProps={{
                            style: { color: theme.palette.text.primary }
                        }}
                        InputLabelProps={{
                            style: { color: theme.palette.text.secondary }
                        }}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                        Submit
                    </Button>
                </Paper>
            </Box>

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>
            )}

            {console.log("Rendering, flashcards:", flashcards)}

            {flashcards === null ? (
                <Typography color="text.primary">Enter text and click submit to generate flashcards.</Typography>
            ) : flashcards.length === 0 ? (
                <Typography color="text.primary">No flashcards generated. Try submitting again.</Typography>
            ) : (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        Flashcards preview
                    </Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ 
                                    backgroundColor: 'background.paper',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 0 15px rgba(255, 20, 147, 0.5)',
                                    }
                                }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(255, 20, 147, 0.2)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: "hidden",
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                    backgroundColor: 'background.paper',
                                                    borderRadius: '10px',
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                }
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="h6" component="div" color="primary">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="body1" component="div" color="secondary">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog 
                open={open} 
                onClose={handleClose}
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        boxShadow: '0 0 20px rgba(255, 20, 147, 0.5)',
                    },
                }}
            >
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText color="text.secondary">
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField 
                        autoFocus 
                        margin="dense" 
                        label="Collection Name" 
                        type="text" 
                        fullWidth 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        variant="outlined" 
                        InputProps={{
                            style: { color: theme.palette.text.primary }
                        }}
                        InputLabelProps={{
                            style: { color: theme.palette.text.secondary }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={saveFlashcards} color="secondary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}