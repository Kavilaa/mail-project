import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <>
      <h2 className="font-medium text-2xl my-4">
        The resource you requested was not found
      </h2>
      <span>
        Go back{" "}
        <Button asChild variant="link">
          <Link to="/">Home</Link>
        </Button>{" "}
      </span>
    </>
  );
};
