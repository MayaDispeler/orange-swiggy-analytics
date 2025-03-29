# 🍽️ Swiggy Order Data Pipeline & Analytics Dashboard

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Dash](https://img.shields.io/badge/Dash-Plotly-blue)](https://dash.plotly.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An end-to-end **Data Engineering + Visualization** project that transforms your personal Swiggy order history into meaningful insights using **Dash**, **Plotly**, and **Pandas**.

This dashboard scrapes structured JSON from your exported Swiggy data, processes it using a custom pipeline, and reveals trends in your food delivery habits — such as top items, restaurants, savings via coupons, delivery times, and much more.

---

## 🚀 Features

- ✅ End-to-end ETL pipeline from raw JSON to interactive insights  
- 📦 Parsing of nested order items, charges, delivery partner info  
- 🧠 Enrichment with calculated fields (e.g., delivery time in hours, distance, veg/non-veg split)  
- 🗺️ Restaurant density mapping using coordinates  
- 📊 Interactive visualizations with Dash & Plotly  
- 💳 Payment method and coupon usage analytics  
- 📈 Time-based ordering trends and delivery performance tracking  

---

## 🧰 Tech Stack

| Layer             | Tools / Libraries                                |
|------------------|--------------------------------------------------|
| Language          | Python 3.8+                                      |
| Data Handling     | Pandas, NumPy, JSON                              |
| Visualization     | Dash, Plotly, Dash DataTable                     |
| Geospatial        | Plotly Densitymapbox                             |
| Frontend Styling  | Dash HTML, Markdown, CSS                         |
| Hosting (Optional)| Render, Streamlit Cloud, or Heroku               |

---

## 🧪 Project Structure

```
├── app.py                   # Main Dash application
├── myordersswiggy.txt       # Exported Swiggy order JSON file
├── requirements.txt         # Python dependencies
├── README.md                # Project documentation
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/swiggy-order-analytics.git
cd swiggy-order-analytics
```

### 2️⃣ Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Add Your Swiggy Data

- Export your Swiggy order history from the Swiggy data download portal.
- Place the `myordersswiggy.txt` file in the root directory of this project.

### 5️⃣ Run the App

```bash
python app.py
```

Visit [http://localhost:8050](http://localhost:8050) in your browser to explore the dashboard.

---

## 📸 Screenshots

> _(Insert screenshots below after running the app)_

- ✅ Time series charts for order value & spend  
- 🗺️ Restaurant heatmaps (delivery hotspots)  
- 📊 Pie charts for item types, time-of-day, coupons, and more  
- 🧾 Tabular views for delivery partners, restaurant types, coupon codes  

---

## 💡 Use Cases

- 📅 Track your food delivery trends over time  
- 🔍 Identify most-ordered items and preferred restaurants  
- 💸 Discover savings from coupons and discounts  
- 🚚 Analyze delivery performance and partner frequency  
- 🧠 Build personal insights from raw customer behavior data  

---

## 📚 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 👤 Author

**Srihari Venkatesan**

- [LinkedIn](https://linkedin.com/in/sriharivvenkatesan)  
- [GitHub](https://github.com/mayadispeler)  
- [Hugging Face](https://huggingface.co/SrihariV)

---

## ✨ Extras

Would you like to extend this?

- [ ] Integrate with a SQL or NoSQL backend  
- [ ] Add time filters or search functionality  
- [ ] Deploy on Streamlit Cloud or Render for public access  
- [ ] Add NLP for order note analysis  
- [ ] Connect with Swiggy APIs (if accessible) for real-time streaming  

---

> 💬 Feel free to fork this, use it for your own Swiggy data, and share your insights!  
> Contributions and pull requests are welcome!
