import { withStyles } from "arwes";

const styles = () => ({
  root: {
    margin: "0 auto",
    maxWidth: 1200,
  },
  "@media (max-width: 1200px)": {
    root: {
      margin: "0 12px",
    },
  },
});

const Centered = (props) => {
  const { classes, className, children, ...rest } = props;
  return (
    <div className={`${classes.root} ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default withStyles(styles)(Centered);
