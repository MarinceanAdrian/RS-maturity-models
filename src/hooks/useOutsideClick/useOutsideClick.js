import { useEffect } from 'react';

const useOutsideClick = (ref, moreDetails, setMoreDetails) => {
  useEffect(() => {
    if (moreDetails) {
      /**
       * Alert if clicked on outside of element
       */
      const handleClickOutside = (event) => {
        if (event.target.className.includes('overlay__folder')) return;
        if (event.target.parentElement.className.includes('overlay')) return;
       
        if (ref.current && !ref.current.contains(event.target)) {
          console.log('ref', ref.current);
          console.log('e', event);
          setMoreDetails(false);
        }
      };

      // Bind the event listenre
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [ref, moreDetails]);
};

export default useOutsideClick;
