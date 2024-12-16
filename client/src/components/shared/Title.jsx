/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";

function Title({ title = "Echo-ChatApp", description = "This is a Chat App" }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}

export default Title;
