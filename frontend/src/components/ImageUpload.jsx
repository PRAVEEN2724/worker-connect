import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadFile } from '../lib/supabase';
import toast from 'react-hot-toast';
import './ImageUpload.css';

export default function ImageUpload({ bucket, folder, value, onChange, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large. Max 2MB.');
      return;
    }

    const type = file.type;
    if (!type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file, bucket, folder);
      onChange(url);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="image-upload">
      <span className="form-label">{label}</span>
      {value ? (
        <div className="image-preview-wrap">
          <img src={value} alt="preview" className="image-preview" />
          <button type="button" className="image-remove" onClick={handleRemove} title="Remove">
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className={`image-dropzone ${uploading ? 'uploading' : ''}`}>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} hidden />
          {uploading
            ? <><Loader size={24} className="spin-icon" /> <span>Uploading...</span></>
            : <><Upload size={24} /> <span>Click to upload</span> <span className="text-subtle" style={{fontSize:'12px'}}>JPG, PNG, WebP · Max 2MB</span></>
          }
        </label>
      )}
    </div>
  );
}
