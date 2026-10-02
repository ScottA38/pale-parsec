import { v7 as uuidGen } from 'uuid';

/** <div class="upload container">
  <form action="/api/updates.json">
    <input type="text" name="title" id="title" required />
  </form>
</div> */

export default function UploadForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const log = document.getElementById('log');
    if (log === null) {
      console.error('Could not find element with id \'log\'');

      return;
    }
    
    if (!form.checkValidity()) {
      log.textContent = 'Please fill in all required fields.';

      return;
    }
    const formData = new FormData(form);
    const tags = formData.get("tags");
    // Check if the list is a csv list of tags
    if (!tags.match(/\s*([\w\d]+\s*[\,$]?)+/)) {
      log.textContent = 'Please enter a comma-separated list of tags.';

      return;
    }
    
    formData.set('uuid', uuidGen());
    const formJson =  {
      blog: {
        content: {
          ...Object.fromEntries(formData.entries())
        }
      }
    };
    fetch(form.action, { method: form.method, body: formJson });
  }

  return (
    <div class="upload container">
      <span class="validation log" id="log"></span>
      <form action="/api/updates.json" method="post" onSubmit="handleSubmit" id="upload-form">
        <input type="text" name="title" id="title" required />
        <input type="text" name="subheading" id="subheading" />
        <textarea type="text" rows="5" cols="40" name="content" title="blog-content" id="blog-content" required />
        <input type="url" name="link" title="related-link" id="related-link" />
        <input type="image" name="images" title="related-images" id="related-images" multiple />
        <input type="text" name="tags" title="article-tags" id="tags" />
      </form> 
    </div>
  );
}