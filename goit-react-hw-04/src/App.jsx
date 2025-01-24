import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import ImageModal from "./components/ImageModal/ImageModal";

const ACCESS_KEY = "UjakUxlD-ULBa859LylxW4gVwIeRlLS2aB_-sNggtu4";
axios.defaults.baseURL = "https://api.unsplash.com";

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/search/photos", {
          params: {
            query,
            page,
            per_page: 12,
            client_id: ACCESS_KEY,
          },
        });

        const { results, total_pages } = response.data;

        setImages((prevImages) =>
          page === 1 ? results : [...prevImages, ...results]
        );
        setHasMore(page < total_pages);

        if (results.length === 0) {
          toast.error("No images found!");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
        toast.error("Failed to fetch images!");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query, page]);

  const handleSubmit = (searchQuery) => {
    if (searchQuery === query) return;

    setQuery(searchQuery);
    setPage(1);
    setImages([]);
    setHasMore(true);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <SearchBar onSubmit={handleSubmit} />

      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <ImageGallery images={images} onImageClick={openModal} />
          {loading && <Loader />}
          {!loading && hasMore && images.length > 0 && (
            <LoadMoreBtn onClick={loadMore} />
          )}
        </>
      )}

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeModal}
          image={selectedImage}
        />
      )}
    </div>
  );
}

export default App;
