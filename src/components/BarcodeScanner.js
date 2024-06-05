import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const BarcodeScanner = () => {
    const [scannedBarcodes, setScannedBarcodes] = useState([]);
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
            .catch(err => console.error('Error accessing camera: ', err));
    };

    const captureImage = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');

        return image;
    };

    const scanBarcodes = async () => {
        const image = captureImage();
        try {
            const response = await axios.post('http://localhost:5000/scan-barcodes', { image });
            setScannedBarcodes(response.data.barcodes.map(barcode => barcode.displayValue));
        } catch (error) {
            console.error('Error scanning barcodes: ', error);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md="8">
                    <Card>
                        <Card.Body>
                            <Card.Title>Barcode Scanner</Card.Title>
                            <video ref={videoRef} style={{ width: '100%' }} />
                            <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
                            <Button variant="primary" className="mt-3" onClick={scanBarcodes}>
                                Scan Barcodes
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4 justify-content-md-center">
                <Col md="8">
                    <Card>
                        <Card.Body>
                            <Card.Title>Scanned Barcodes</Card.Title>
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
