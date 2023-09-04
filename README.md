LaTeX Handwritten Character Converter
This is a code repository for converting handwritten characters into LaTeX equation code. It is implemented as a web application using Flask. This application utilizes parameters learned through Convolutional Neural Networks (CNN) for image recognition.

How It Works
Input Handwritten Character: Mathematical expressions written on a web canvas are converted to images and connected to the Mathematical Code Conversion Unit.

CNN-Based Recognition: The application uses a Convolutional Neural Network (CNN) model, which has been trained to recognize handwritten characters, to process the image.

Generate LaTeX Code: Once the recognition is complete, the application generates LaTeX code that represents the handwritten character.

Copy and Use: You can then copy the generated LaTeX code and use it in your LaTeX documents or equations.

Usage
To use this tool, simply follow the instructions on the web application's interface. Upload your handwritten character, and the tool will do the rest. You will receive the LaTeX code that corresponds to the input character.

Requirements
To run this web application locally, you will need:

Python
Flask


Getting Started
Clone this repository to your local machine.

Install the required dependencies:

Copy code
pip install flask

Run the Flask application:

Copy code
python app.py
Access the web application through your browser and start converting handwritten characters into LaTeX code!

Acknowledgments
This project is made possible by leveraging the power of Convolutional Neural Networks for character recognition. We would like to thank the machine learning community for their contributions to this field.
