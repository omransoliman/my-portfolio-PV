from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

# Path to the Excel file
EXCEL_FILE = 'reviews.xlsx'

# Load reviews from Excel
def load_reviews():
    try:
        return pd.read_excel(EXCEL_FILE)
    except FileNotFoundError:
        # Create a new Excel file with sample data if it doesn't exist
        sample_data = {
            'FullName': ['John Doe', 'Jane Smith', 'Alice Brown', 'Bob Johnson', 'Charlie Davis',
                         'Eva Green', 'Frank White', 'Grace Lee', 'Henry Clark', 'Irene Adams'],
            'Rating': [5, 4, 5, 3, 5, 4, 2, 5, 4, 5],
            'Comment': [
                'Amazing work! Highly recommend.',
                'Very professional and creative.',
                'Absolutely stunning photos!',
                'Good, but could be better.',
                'Perfect in every way!',
                'Loved the experience!',
                'Not what I expected.',
                'Exceptional service!',
                'Great work, highly recommend.',
                'Best photographer ever!'
            ],
            'ProfileImage': [
                'john.jpg', 'jane.jpg', 'alice.jpg', 'bob.jpg', 'charlie.jpg',
                'eva.jpg', 'frank.jpg', 'grace.jpg', 'henry.jpg', 'irene.jpg'
            ],
            'Date': [
                '2023-10-01', '2023-10-02', '2023-10-03', '2023-10-04', '2023-10-05',
                '2023-10-06', '2023-10-07', '2023-10-08', '2023-10-09', '2023-10-10'
            ],
            'Location': [
                'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
                'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
            ]
        }
        df = pd.DataFrame(sample_data)
        df.to_excel(EXCEL_FILE, index=False)
        return df

# Home route to serve reviews.html
@app.route('/')
def home():
    reviews = load_reviews()
    return render_template('reviews.html', reviews=reviews.to_dict('records'))

# API endpoint to fetch reviews
@app.route('/api/get-reviews', methods=['GET'])
def get_reviews():
    reviews = load_reviews()
    return jsonify(reviews.to_dict('records'))

# API endpoint to submit a new review
@app.route('/api/submit-review', methods=['POST'])
def submit_review():
    data = request.json
    new_review = {
        'FullName': data['fullName'],
        'Rating': data['rating'],
        'Comment': data['comment'],
        'ProfileImage': data['profileImage'],
        'Date': data['date'],
        'Location': data['location']
    }

    # Append to Excel file
    reviews = load_reviews()
    reviews = reviews.append(new_review, ignore_index=True)
    reviews.to_excel(EXCEL_FILE, index=False)

    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)