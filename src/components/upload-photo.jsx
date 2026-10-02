import { v7 as uuidGen } from 'uuid';

/** <div class="upload container">
  <form action="/api/updates.json">
    <input type="text" name="title" id="title" required />
  </form>
</div> */

export default function UploadForm() {
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const log = document.getElementById('log');
    const dataSkeleton = {
      blog: {
        content: {
          images: []
        }
      }
    };
    if (log === null) {
      console.error('Could not find element with id \'log\'');

      return;
    }
    
    if (!form.checkValidity()) {
      log.textContent = 'Please fill in all required fields.';

      return;
    }

    console.log('form is valid');
    for (const [ key, value ] of formData.entries()) {
      console.log(key, value);
      if (key === 'tags') {
        dataSkeleton.blog.content[key] = value.split(",").map(v => v.trim());
        continue;
      }

      dataSkeleton.blog.content[key] = value ?? ""; 
    }

    dataSkeleton.blog.content['uuid'] = uuidGen();
    const apiResponse = await fetch(form.action, {
      method: form.method,
      body: JSON.stringify(dataSkeleton)
    });

    if (!apiResponse.ok()) {
      const responseJson = await apiResponse.json();

      if (responseJson.status === 400) {
        alert(responseJson)
      }
    }
  }

  return (
    <div className="upload container">
      <span className="validation log" id="log"></span>
      <form action="/api/updates.json" method="post" onSubmit={handleSubmit} id="upload-form">
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" form="upload-form" required />
        <label htmlFor="subheading">Subheading</label>
        <input type="text" name="subheading" id="subheading" form="upload-form" />
        <label htmlFor="content">Content</label>
        <textarea rows="5" cols="40" name="body" id="body" form="upload-form" required />
        <label htmlFor="related-link">Related Link</label>
        <input type="url" name="link" title="related-link" id="related-link" form="upload-form" />
        <label htmlFor="images">Related Images</label>
        <input type="image" name="images" title="related-images" id="related-images" form="upload-form" multiple />
        <label htmlFor="tags">Tags</label>
        <input type="text" name="tags" title="article-tags" id="tags" form="upload-form" />
        <input type="submit"/>
      </form> 
    </div>
  );
}