import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Card, ListGroup, Spinner, Alert, Navbar, Nav } from 'react-bootstrap';
import { FaBarcode, FaCamera, FaSearch } from 'react-icons/fa';
import '../App.css'; // Import the custom CSS

const BarcodeScanner = () => {
    const [scannedBarcodes, setScannedBarcodes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startVideo();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => {
                console.error('Error accessing camera: ', err);
                setError('Error accessing camera. Please try again.');
            });
    };

    const captureImage = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');

        return image;
    };

    const scanBarcodes = async () => {
        setError('');
        setIsLoading(true);
        const image = captureImage();
        try {
            const response = await axios.post('http://localhost:5000/api/barcodes', { image });
            setScannedBarcodes(response.data.barcodes.map(barcode => barcode.description));
        } catch (error) {
            console.error('Error scanning barcodes: ', error);
            setError('Error scanning barcodes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md="8">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title className="gold-title">Barcode Scanner</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <video ref={videoRef} style={{ width: '100%' }} />
                            <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
                            <div className="text-center mt-3">
                                <Button variant="primary" onClick={scanBarcodes} disabled={isLoading}>
                                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Scan Barcodes'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4 justify-content-md-center">
                <Col md="8">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title className="gold-title">Scanned Barcodes</Card.Title>
                            <ListGroup variant="flush">
                                {scannedBarcodes.length > 0 ? (
                                    scannedBarcodes.map((barcode, index) => (
                                        <ListGroup.Item key={index}>{barcode}</ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>No barcodes scanned yet.</ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BarcodeScanner;
