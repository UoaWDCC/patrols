const useDraftStatus = () => {
  const draft = localStorage.getItem("observations");
  return draft !== null && draft !== "[]";
};

export default useDraftStatus;
