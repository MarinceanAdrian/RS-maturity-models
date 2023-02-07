import React from 'react';
import { useContext } from 'react';
import { FoldersContext } from '../../../context/folders-context/folders-context';
import Folder from './Folder';
import classes from './FolderStructure.module.css';
import Spinner from '../../UI/Spinner';

const FolderStructure = ({ isCreatingNewFolder, setIsCreatingNewFolder }) => {
  const { folders, isLoading } = useContext(FoldersContext);
  return (
    <section className={classes['folder-structure']}>
      {isCreatingNewFolder ? (
        <Folder
          newFolderInput={true}
          isCreatingNewFolder={isCreatingNewFolder}
          setIsCreatingNewFolder={setIsCreatingNewFolder}
        />
      ) : (
        <div style={{ padding: '1.55rem' }}></div>
      )}
      {folders.map((folder) => (
        <Folder {...folder} key={folder.folderId} />
      ))}
      {isLoading && <Spinner />}
    </section>
  );
};

export default FolderStructure;