from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Optional: Fine-tuned model name
FINETUNED_MODEL = os.getenv("FINETUNED_MODEL")  # ex: "ft:gpt-4o-mini:your-id:2025-01-01"


# -------------------------------
# Simple Hazard Classifier (baseline)
# -------------------------------
def classify_hazard(text):
    if not text:
        return "unknown"

    t = text.lower()

    if "fire" in t or "smoke" in t:
        return "fire"
    if "explosion" in t or "blast" in t:
        return "explosion"
    if "earthquake" in t or "tremor" in t:
        return "earthquake"

    return "unknown"


# -------------------------------
# AI Route → Main Safety Response Generation
# -------------------------------
@app.route("/ai/respond", methods=["POST"])
def respond():
    try:
        data = request.json or {}
        query = data.get("query", "")
        location = data.get("location", "unknown")
        weather = data.get("weather")  # data sent from backend
        hazard = classify_hazard(query)

        # Build system prompt (AI context)
        system_prompt = (
            f"You are a civil defence emergency assistant.\n"
            f"Hazard Type: {hazard}.\n"
            f"User Location: {location}.\n"
            f"Weather Info: {weather if weather else 'not available'}.\n\n"
            f"Your job is to give:\n"
            f"- Step-by-step survival instructions\n"
            f"- Location-aware guidance\n"
            f"- Short, clear, and actionable steps\n"
            f"- Emergency contact recommendations\n"
        )

        user_prompt = f"User says: {query}. Provide urgent instructions."

        # SELECT MODEL → Fine-tuned OR normal GPT model
        model_to_use = FINETUNED_MODEL if FINETUNED_MODEL else "gpt-4o-mini"

        # Call the OpenAI API → Chat Completion
        response = openai.chat.completions.create(
            model=model_to_use,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=300,
            temperature=0.2
        )

        ai_message = response.choices[0].message["content"]

        return jsonify({
            "status": "success",
            "hazard": hazard,
            "response": ai_message
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# -------------------------------
# Test Route → Check AI service
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI microservice is running!", "status": "ok"})


# -------------------------------
# Run Flask App
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
