import React from 'react';
import './App.css';
import BarcodeScanner from './components/BarcodeScanner';
import { Navbar, Container } from 'react-bootstrap';

function App() {
    return (
        <div className="App">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Barcode Scanner App</Navbar.Brand>
                </Container>
            </Navbar>
            <main className="my-4">
                <BarcodeScanner />
            </main>
        </div>
    );
}

export default App;
