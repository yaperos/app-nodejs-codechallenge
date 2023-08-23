import React from "react";
import { SegmentText } from "../atomos";
type SegmentProps = {
  labels: string[];
  borderBottom: boolean;
};

const HeaderLeftSegments: React.FC<SegmentProps> = ({
  labels,
  borderBottom,
}) => {
  return (
    <>
      {labels.map((segment, i) => (
        <SegmentText label={segment} borderBottom={borderBottom} key={i} />
      ))}
    </>
  );
};

export default HeaderLeftSegments;
