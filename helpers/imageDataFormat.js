exports.imageDataFormat = (data) => {
  const { secure_url, width, height, public_id, responsive_breakpoints } = data;
  const formatBreakpoints = (arr) => {
    const newarr = [];
    for (let item of arr) {
      newarr.push({
        width: item.width,
        height: item.height,
        secure_url: item.secure_url,
      });
    }
    return newarr;
  };
  return {
    secure_url,
    public_id,
    width,
    height,
    breakpoints: formatBreakpoints(responsive_breakpoints[0]["breakpoints"]),
  };
};
