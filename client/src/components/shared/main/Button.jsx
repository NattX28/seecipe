const Button = ({ text, color = "#ffa725", classOther = "" }) => {
  return (
    <div
      className={`btn rounded-full text-white ${classOther}`}
      style={{ backgroundColor: color }}>
      {text}
    </div>
  );
};
export default Button;
