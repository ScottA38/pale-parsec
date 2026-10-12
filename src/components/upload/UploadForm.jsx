import { v7 as uuidGen } from 'uuid';
import { useState } from 'react';
import { validateTagInput } from './TagsInput';
import TagsInput from './TagsInput';
import ImageUploader from './ImageUploader';

export default function UploadForm({ currentUser }) {
  const errors = [];
  const [ formData, setFormData ] = useState({
    title: '',
    subheading: '',
    body: '',
    tags: '',
    image: '',
    author: currentUser.username
  });

  function handleTextInput(e) {
    const escapedValue = e.target.value
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
    if (escapedValue == "") {
      errors.push(`Please include test content in ${e.target.name}`)
    }

    setFormData((previousFormData) => ({
      ...previousFormData,
      [e.target.name]: escapedValue
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      errors.push('Please fill in all required fields.');
      return;
    }

    if (validateTagInput(formData.tags).length > 0) {
      return;
    }

    const dataSkeleton = {
      blog: {
        content: {
          title: formData.title,
          subheading: formData.subheading,
          body: formData.body,
          author: formData.author,
          images: formData.image ? [formData.image] : [],
          tags: formData.tags.split(",").map((tag) => tag.trim()),
          uuid: uuidGen()
        }
      }
    };

    const apiResponse = await fetch(form.action, {
      method: form.method,
      body: JSON.stringify(dataSkeleton)
    });

    if (!apiResponse.ok) {
      const responseJson = await apiResponse.json();

      if (responseJson.status === 400) {
        return new Response(`Failed to upload form: ${responseJson.message}`);
      }
    }
  }

  return (
    <div className="upload container">
      <ul className="validation error log" id="log">
        {
          errors.map((error) => (
            <li class="validation error item">{error}</li>
          ))
        }
      </ul>
      <form action="/api/updates.json" method="post" onSubmit={handleSubmit} id="upload-form">
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" form="upload-form" onChange={handleTextInput} required />
        <label htmlFor="subheading">Subheading</label>
        <input type="text" name="subheading" id="subheading" onChange={handleTextInput} form="upload-form" />
        <label htmlFor="body">Content</label>
        <textarea rows="5" cols="40" name="body" id="body" form="upload-form" onChange={handleTextInput} required />
        <ImageUploader formTarget="upload-form" changeHandler={(image64Bit) => {
          setFormData((previousFormData) => ({
            ...previousFormData,
            image: image64Bit
          }));
        }} />
        <TagsInput formTarget={'upload-form'} changeHandler={(e) => {
          setFormData((previousFormData) => ({
            ...previousFormData,
            tags: e.target.value
          }));
        }} />
        <input type="hidden" name="author" value={currentUser.username} form="upload-form" />
        <input type="submit"/>
      </form>
    </div>
  );
}