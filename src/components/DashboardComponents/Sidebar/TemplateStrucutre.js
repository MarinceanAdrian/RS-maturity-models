import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import classes from './TemplateStructure.module.css';
import { TemplateContext } from '../../../context/templates-context/templates-context';
import useFirestoreForTemplates from '../../../hooks/useFirestore/useFirestoreForTemplates';

const TemplateTag = React.lazy(() => import('./TemplateTag'));
const Spinner = React.lazy(() => import('../../UI/Spinner'));

const TemplateStrucutre = () => {
const { templateTags, setTemplateTags } = useContext(TemplateContext);

  return (
    <ul className={classes['sidebar__template-tags']}>
      <Suspense fallback={<Spinner />}>
        {templateTags.length > 0 &&
          templateTags.map((templateTag, index) => (
            <TemplateTag {...templateTag} setTemplateTags={setTemplateTags}  key={templateTag.id} />
          ))}
      </Suspense>
    </ul>
  );
};

export default TemplateStrucutre;
