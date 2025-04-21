import axios from 'axios';

export const handleFormSubmit = async ({
    endpoint,
    id,
    formData,
    setItems,
    successMessage = 'Operation successful!',
    navigateTo,
    navigate,
}) => {
    // Filter out empty values from formData to avoid sending empty strings to the server
    const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
    );

    try {
        let response;
        // Check if id is provided to determine if we're updating or creating
        if (id) { 
            // Update existing item (book, author, series)
            response = await axios.put(`${endpoint}/${id}`, filteredFormData);
            if (setItems) {
                setItems((prevItems) =>
                    prevItems.map((item) => (item._id === id ? response.data : item))
                );
            }
        } else {
            // Create new item (book, author, series)
            response = await axios.post(endpoint, filteredFormData);
            if (setItems) {
                setItems((prevItems) => [...prevItems, response.data]);
            }
        }

        alert(successMessage);
        // Optionally navigate to a different page after successful submission
        // Check if navigateTo is provided and navigate function is available
        if (navigateTo && navigate) {
            navigate(navigateTo);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    }
};