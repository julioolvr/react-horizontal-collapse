import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  FC,
  HTMLAttributes,
  ReactNode,
} from 'react';
import useDimensions from 'react-cool-dimensions';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  keepInitial?: number;
  keepLast?: number;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
export const HorizontalCollapse: FC<Props> = ({
  keepInitial = 1,
  keepLast = 1,
  children,
}) => {
  const { ref: containerRef, width: containerWidth } = useDimensions<
    HTMLDivElement
  >();
  const { ref: contentRef, width: contentWidth } = useDimensions<
    HTMLDivElement
  >();
  const measurementContainerRef = useRef<HTMLDivElement>(null);
  const [skippedChildren, setSkippedChildren] = useState(0);

  const resize = useCallback(() => {
    // 1. Measure each child by rendering them
    if (!measurementContainerRef.current) {
      // Can't resize if there's no ref to the invisible measurement container
      return;
    }

    const children = Array.from(measurementContainerRef.current.children);

    const childrenMeasurements = children.map(
      (child) => child.getBoundingClientRect().width
    );
    // 2. Measure the placeholder element, if any (TODO)

    // 3. Add up the minimum start and end elements
    const initialWidth = childrenMeasurements
      .slice(0, keepInitial)
      .reduce((total, child) => total + child, 0);
    const finalWidth = childrenMeasurements
      .slice(children.length - keepLast)
      .reduce((total, child) => total + child, 0);

    // 4. If there's any remaining space, add child one by one until it fills up
    const remainingChildren = children.length - keepInitial - keepLast;
    let usedWidth = initialWidth + finalWidth;
    let skippedChildren = remainingChildren;

    while (
      usedWidth + childrenMeasurements[keepInitial + skippedChildren - 1] <
        containerWidth &&
      skippedChildren > 0
    ) {
      usedWidth += childrenMeasurements[keepInitial + skippedChildren - 1];
      skippedChildren--;
    }

    setSkippedChildren(skippedChildren);
  }, [keepInitial, keepLast, containerWidth, setSkippedChildren]);

  const previousContainerWidth = usePrevious(containerWidth);
  const containerWidthGrew =
    skippedChildren > 0 &&
    previousContainerWidth !== null &&
    previousContainerWidth < containerWidth;
  // TODO: If we keep track of the next child to add when the container grows,
  // so we only run resize if there might be enough space for a new item.
  useEffect(resize, [containerWidthGrew]);

  const isContentGreaterThanContainer = contentWidth > containerWidth;
  useEffect(() => {
    if (isContentGreaterThanContainer) {
      resize();
    }
  }, [resize, isContentGreaterThanContainer]);

  const childrenArray = React.Children.toArray(children);

  const childrenToRender = [
    ...childrenArray.slice(0, keepInitial),
    ...childrenArray.slice(keepInitial + skippedChildren),
  ];

  return (
    <div ref={containerRef} style={{ display: 'flex', maxWidth: '100%' }}>
      {/* TODO: Don't always render this thing, only when needed */}
      <div
        ref={measurementContainerRef}
        style={{ display: 'flex', position: 'absolute', visibility: 'hidden' }}
      >
        {children}
      </div>

      <div ref={contentRef} style={{ display: 'flex' }}>
        {childrenToRender}
      </div>
    </div>
  );
};

function usePrevious<T>(value: T): T | null {
  const previous = useRef<T | null>(null);

  useEffect(() => {
    previous.current = value;
  });

  return previous.current;
}
