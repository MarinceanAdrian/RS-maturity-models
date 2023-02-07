import React, { useCallback, useEffect, useState } from 'react';
import uuid from 'react-uuid';
import useFirestoreForTemplates from '../../hooks/useFirestore/useFirestoreForTemplates';

const ALL_CATEGORIES = 'all_categories';

export const TemplateContext = React.createContext({
  templateTags: [],
  setTemplateTags: () => {},
});

const TemplateContextProvider = ({ children }) => {
  const [templateTags, setTemplateTags] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);

  const { getTemplatesCategory, getTemplateSurveys } = useFirestoreForTemplates();
  useEffect(() => {
    fetchTemplatesData();
  }, []);

  const fetchTemplatesData = useCallback(async () => {
    const templates = await getTemplatesCategory();
    const allTemplates = await getTemplateSurveys();

    const templatesCategory = templates.categories.map((item, index) => {
      const number = allTemplates.filter((template) => template.category === item).length;

      return {
        title: item,
        number,
        id: uuid(),
        isActive: false,
        category: item,
      };
    });

    // all category added manually
    templatesCategory.unshift({
      title: ALL_CATEGORIES,
      number: allTemplates.length,
      id: uuid(),
      isActive: true,
      category: ALL_CATEGORIES,
    });

    setTemplates(allTemplates);
    setAllTemplates(allTemplates);
    setTemplateTags(templatesCategory);
  }, []);

  const filterTemplatesOnClick = (category) => {
    if (category === ALL_CATEGORIES) {
      setTemplates(allTemplates);
    } else {
      const filteredTemplates = allTemplates.filter((template) => template.category == category);
      setTemplates(filteredTemplates);
    }
  };

  return (
    <TemplateContext.Provider
      value={{
        templateTags,
        setTemplateTags,
        templates,
        setTemplates,
        filterTemplatesOnClick,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateContextProvider;
