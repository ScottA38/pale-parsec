import { useState } from 'react';

export function validateTagInput(tagInputValue) {
  const formatValidation = /^(\s?[\w\d_\-]+\s*\,?)+$/

    if (tagInputValue === '') {
      return [ 'Please enter some tags'];
    } 
    
    if (!tagInputValue.match(formatValidation)) {
      return ['Tags must have no punctuation and each be separated by a comma'];
    }
    
    return [];
}

export default function TagsInput({ formTarget, changeHandler }) {
  const [errors, setErrors] = useState([]);

  function onChange(e) {
    const newErrors = validateTagInput(e.target.value);
    setErrors(newErrors);

    if (changeHandler) {
      changeHandler(e);
    }
  }

  return (
    <div className="tags-input">
      <label htmlFor="tags">Article Tags</label>
      <input
        type="text"
        name="tags"
        title="tags"
        id="tags"
        placeholder="Enter tags separated by commas"
        aria-invalid={errors.length > 0}
        onChange={onChange}
        form={formTarget}
      />
      {errors.map((error) => (
        <span key={error} className="error" role="alert">
          {error}
        </span>
      ))}
    </div>
  )
}