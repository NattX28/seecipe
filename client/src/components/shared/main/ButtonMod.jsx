const ButtonMod = ({ text, color = "#ffa725", classOther = "" }) => {
  return (
    <div
      className={`btn rounded-full text-white ${classOther}`}
      style={{ backgroundColor: color }}>
      {text}
    </div>
  );
};
export default ButtonMod;
