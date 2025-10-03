import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../hooks/axiosIntance/AxiosIntance';

const SystemSettings = () => {
    const [logoPreview, setLogoPreview] = useState([]);
    const [logoType, setLogoType] = useState('text');
    const [textLogo, setTextLogo] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchLogo();
    }, []);

    const fetchLogo = async () => {
        try {
            const res = await axiosInstance.get("/logo");
            if (res.data) {
                setLogoPreview(res.data);
                // Set the current logo type and value
                if (res.data.type === 'text') {
                    setLogoType('text');
                    setTextLogo(res.data.text || '');
                } else if (res.data.type === 'image') {
                    setLogoType('image');
                    setImagePreview(res.data.url || '');
                }
            }
        } catch (error) {
            console.error('Error fetching logo:', error);
        }
    };

    const handleLogoTypeChange = (e) => {
        setLogoType(e.target.value);
        setError('');
        setSuccess('');
        setImagePreview('');
        setImageFile(null);
        setTextLogo('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');
        
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Only PNG, JPG, and JPEG formats are allowed');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setError('File size must be less than 5MB');
            return;
        }

        setImageFile(file);
        
        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const uploadToImgBB = async () => {
        if (!imageFile) {
            setError('Please select an image');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch('https://api.imgbb.com/1/upload?key=b71e82bef4abc2fc5b5954901bf3cde4', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Save the ImgBB URL to backend
                try {
                    const response = await axiosInstance.post('/logo', { 
                        type: 'image', 
                        url: data.data.url 
                    });
                    setSuccess('Image uploaded and saved successfully!');
                    console.log('Uploaded image URL:', data.data.url);
                    console.log('Backend response:', response.data);
                    
                    // Refresh logo data
                    fetchLogo();
                } catch (backendError) {
                    setError('Image uploaded but failed to save to server');
                    console.error('Backend error:', backendError);
                }
            } else {
                setError('Failed to upload image');
            }
        } catch (err) {
            setError('Error uploading image: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleTextLogoSubmit = async () => {
        if (!textLogo.trim()) {
            setError('Please enter logo text');
            return;
        }

        setError('');
        setSuccess('');

        try {
            // Save text logo to backend
            await axiosInstance.post('/logo', { type: 'text', text: textLogo });
            setSuccess('Text logo saved successfully!');
            console.log('Text logo:', textLogo);
        } catch (err) {
            setError('Error saving text logo: ' + err.message);
        }
    };

    return (
        <div className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-2xl font-bold mb-6'>System Settings</h1>
            
            {/* Logo Type Selection */}
            <div className='mb-6'>
                <label className='block text-gray-700 font-semibold mb-2'>
                    Select Logo Type
                </label>
                <select 
                    value={logoType}
                    onChange={handleLogoTypeChange}
                    className='w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                    <option value='text'>Text Logo</option>
                    <option value='image'>Image Logo</option>
                </select>
            </div>

            {/* Text Logo Input */}
            {logoType === 'text' && (
                <div className='mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                    <label className='block text-gray-700 font-semibold mb-2'>
                        Enter Logo Text
                    </label>
                    <input 
                        type='text'
                        value={textLogo}
                        onChange={(e) => setTextLogo(e.target.value)}
                        placeholder='Enter your logo text'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                    
                    {/* Text Preview */}
                    {textLogo && (
                        <div className='mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                            <p className='text-sm text-gray-600 mb-2'>Preview:</p>
                            <h2 className='text-3xl font-bold text-blue-600'>{textLogo}</h2>
                        </div>
                    )}

                    <button 
                        onClick={handleTextLogoSubmit}
                        className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
                    >
                        Save Text Logo
                    </button>
                </div>
            )}

            {/* Image Logo Upload */}
            {logoType === 'image' && (
                <div className='mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                    <label className='block text-gray-700 font-semibold mb-2'>
                        Upload Logo Image
                    </label>
                    <p className='text-sm text-gray-500 mb-4'>
                        Accepted formats: PNG, JPG, JPEG | Max size: 5MB
                    </p>
                    
                    <input 
                        type='file'
                        accept='image/png, image/jpeg, image/jpg'
                        onChange={handleFileChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className='mt-6'>
                            <p className='text-sm text-gray-600 mb-3 font-medium'>Image Preview:</p>
                            <div className='flex justify-center items-center p-4 bg-gray-50 rounded-lg border border-gray-200'>
                                <img 
                                    src={imagePreview} 
                                    alt='Logo Preview' 
                                    className='max-w-full max-h-64 object-contain rounded-lg shadow-md'
                                />
                            </div>
                            <div className='mt-3 text-sm text-gray-600'>
                                <p><span className='font-medium'>File name:</span> {imageFile?.name}</p>
                                <p><span className='font-medium'>File size:</span> {(imageFile?.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                    )}

                    {imageFile && (
                        <button 
                            onClick={uploadToImgBB}
                            disabled={uploading}
                            className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            {uploading ? (
                                <>
                                    <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Upload Image'
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-red-700 text-sm font-medium'>{error}</p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-green-700 text-sm font-medium'>{success}</p>
                </div>
            )}
        </div>
    );
};

export default SystemSettings;