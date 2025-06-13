from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Setup MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["inventory"]
collection = db["items"]

# Helper to convert ObjectId
def serialize_item(item):
    item["_id"] = str(item["_id"])
    return item

@app.route('/api/items', methods=['GET'])
def get_items():
    items = list(collection.find())
    return jsonify([serialize_item(item) for item in items])

@app.route('/api/items', methods=['POST'])
def add_item():
    data = request.json
    result = collection.insert_one({
        "name": data["name"],
        "quantity": data["quantity"],
        "price": data["price"]
    })
    return jsonify({"message": "Item added", "id": str(result.inserted_id)}), 201

@app.route('/api/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    result = collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": {"quantity": data["quantity"]}}
    )
    return jsonify({"message": "Quantity updated"})

@app.route('/api/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    result = collection.delete_one({"_id": ObjectId(item_id)})
    return jsonify({"message": "Item deleted"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render or others will set PORT
    app.run(host='0.0.0.0', port=port)

