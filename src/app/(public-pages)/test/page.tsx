import ImageUploadEditor from "./ImageDropZone";

const TestPage = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <ImageUploadEditor multiple maxFiles={2} />
    </div>
  );
};

export default TestPage;
