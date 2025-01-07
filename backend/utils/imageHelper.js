// Helper function to convert image buffer to base64
const convertImageToBase64 = (file) => {
    return file.buffer.toString('base64');
  };
  
  module.exports = { convertImageToBase64 };
  