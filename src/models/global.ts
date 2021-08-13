import { useState, useCallback } from 'react';

export default function global() {
  const [breadcrumbData, setBreadcrumbData] = useState([]);

  const updateBreadcrumbData = useCallback((newBreadcrumbData) => {
    setBreadcrumbData(newBreadcrumbData);
  }, []);

  return {
    breadcrumbData,
    updateBreadcrumbData,
  };
}
