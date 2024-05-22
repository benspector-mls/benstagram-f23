import { createPost } from "../adapters/post-adapter";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext"
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget";
import CloudinaryContext from '../contexts/CloudinaryContext'
import { fill } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from '@cloudinary/react';

export default function NewPostPage() {
  const navigate = useNavigate();
  const { cloudName, uploadPreset, cld } = useContext(CloudinaryContext)
  const { currentUser } = useContext(CurrentUserContext);

  const [publicId, setPublicId] = useState("");
  const [postContent, setPostContent] = useState("");
  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    multiple: false,
    cropping: true,
    croppingAspectRatio: 1
  });

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();

    if (!postContent || !publicId) return;
    await createPost({
      content: postContent,
      img_public_id: publicId,
      user_id: currentUser.id,
    });
    navigate(`/users/${currentUser.id}`)
  }

  const image = cld.image(publicId);
  image.resize(fill().width(500).height(500));

  return (
    <form id='new-post-form-container' className="flex-container column centered" onSubmit={handleNewPostSubmit}>
      <h1>Create A Post</h1>

      <AdvancedImage cldImg={image}></AdvancedImage>

      <div className="w-100">
        <label htmlFor="post-content-input" style={{ display: 'none' }}>What do you want to say?</label>
        <textarea maxLength="140" id='post-content-input' className='w-100' value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="what do you want to say?" />
      </div>
      {
        !publicId
          ? <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
          : <button>Post</button>
      }

    </form>
  );
}
