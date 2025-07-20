from flask import Flask, render_template
import json
from datetime import date

app = Flask(__name__)

def load_content():
    with open('content.json', 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/')
def home():
    content = load_content()
    today = date.today()
    birthday_date = date(2025, 7, 28)

    # --- Daily Message Logic ---
    days_left_for_message = (birthday_date - today).days
    
    daily_message = ""
    if 0 < days_left_for_message <= len(content['daily_messages']):
        message_index = len(content['daily_messages']) - days_left_for_message
        daily_message = content['daily_messages'][message_index]
        
    return render_template(
        'index.html',
        daily_message=daily_message,
        slideshow_data=content['slideshow'],
        love_letter=content['love_letter'],
        partner_name=content['partner_name']
    )

if __name__ == '__main__':
    print("🎉 Birthday server starting! Open http://127.0.0.1:5000 in your browser.")
    app.run(host='0.0.0.0', port=5000, debug=True)
