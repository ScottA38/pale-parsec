export default function ImageUploader({ formTarget, changeHandler }) {
  function onChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        changeHandler(reader.result);
      }
    }
    reader.onerror = () => {
      console.error('Unable to read the selected image', reader.error);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="image-upload">
      <label htmlFor="related-images">Related Image</label>
      <input
        name="images"
        className="related-images"
        type="file"
        id="related-images"
        accept="image/jpeg,image/png,image/avif,image/webp"
        form={formTarget}
        onChange={onChange}
      />
    </div>
  );
}