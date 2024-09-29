import { SignIn } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

//sx = {{backgroundColor: "#3f51b5"}}



export default function SignUpPage(){
    return (<Container maxWidth="100vw">
        <AppBar position = "static" >
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow:1}}>
                    <Link href="./" passHref style={{textDecoration: 'none', boxShadow: 'none', color: 'inherit'}}>Flashcard SaaS</Link>
                </Typography>
                <Button color = "inherit" >
                    <Link href = "/sign-in" passHref style={{textDecoration: 'none', boxShadow: 'none', color: 'inherit'}} >Login</Link>
                </Button>
                <Button color = "inherit" >
                    <Link href = "/sign-up" passHref style={{textDecoration: 'none', boxShadow: 'none', color: 'inherit'}}>Sign Up</Link>
                </Button>
            </Toolbar>
        </AppBar>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant = "h4">Sign In</Typography>
            <SignIn/>
        </Box>
    </Container>)
}