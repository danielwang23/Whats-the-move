import React, { useState } from 'react';
import './QuestionPage2CSS.css';

const options = [
  { category: "Entertainment", items: ["Concerts", "Movies", "Theater", "Comedy Shows"] },
  { category: "Arts & Culture", items: ["Museums", "Art Galleries", "Cultural Festivals"] },
  { category: "Sports & Fitness", items: ["Games", "Fitness Classes", "Outdoor Adventures"] },
  { category: "Educational", items: ["Lectures", "Workshops", "Seminars"] },
  { category: "Social Events", items: ["Parties", "Networking Events", "Club Meetings"] },
  { category: "Volunteer Opportunities", items: ["Community Service", "Fundraisers"] },
  { category: "Shopping", items: ["Markets", "Fairs", "Pop-up Shops"] },
  { category: "Relaxation", items: ["Spas", "Parks", "Quiet Cafes"] }
];

function Question2Page({ onNext }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (category) => {
    setSelectedOptions((prev) =>
      prev.includes(category)
        ? prev.filter((option) => option !== category)
        : [...prev, category]
    );
  };

  const handleNext = () => {
    if (selectedOptions.length) {
      onNext();
    }
  };

  return (
    <div className="question-wrapper">
      <div className="question-page">
        <h1 className="question-title">What are your activity preferences?</h1>
        <div className="options-container">
          {options.map((option) => (
            <div
              key={option.category}
              className={`option-box ${selectedOptions.includes(option.category) ? 'selected' : ''}`}
              onClick={() => toggleOption(option.category)}
            >
              <h3 className="option-category">{option.category}</h3>
              <ul className="option-items">
                {option.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={handleNext} disabled={!selectedOptions.length} className="next-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default Question2Page;