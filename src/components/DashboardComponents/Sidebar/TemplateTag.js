import React, { useContext } from 'react';
import classes from './TemplateTag.module.css';
import { TemplateContext } from '../../../context/templates-context/templates-context';

import { roStrings } from '../romanian.ts';

const TemplateTag = ({ isActive, title, id, number, category }) => {
  const { setTemplateTags, filterTemplatesOnClick } = useContext(TemplateContext);
  const templateStrings = roStrings.templates;
  let tagClassName = `${classes['sidebar__template-tags__tag']} ${isActive && classes.active}`;

  const makeTagActiveHandler = () => {
    filterTemplatesOnClick(category);
    setTemplateTags((prevTemplateTags) =>
      prevTemplateTags.map((template) => {
        if (template.isActive) {
          return {
            ...template,
            isActive: false,
          };
        }

        if (template.id === id) {
          return {
            ...template,
            isActive: true,
          };
        }
        return template;
      })
    );
  };

  return (
    <li className={tagClassName} onClick={() => makeTagActiveHandler()}>
      <p>{templateStrings[`template_${title}`]}</p>
      <span>{number}</span>
    </li>
  );
};

export default TemplateTag;
