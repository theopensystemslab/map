import { h } from "preact";
import { useState } from "preact/hooks";

type StaticMapProps = {
  props: any
};

// Thinking this would be preact functional component
//   similar to https://taylor.callsen.me/using-openlayers-with-react-functional-components/
//   BUT failing to import/recognize hooks from both preact/hooks and preact/compat
const StaticMap = ({ props }: StaticMapProps) => {
  const [staticMap, setStaticMap] = useState();

  return (
    <div>
      <p>MAP!</p>
    </div>
  );
}

export default StaticMap;
