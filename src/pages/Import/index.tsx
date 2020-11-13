import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    data.append('file', uploadedFiles[0].file as Blob);

    try {
      const response = await api.post<{ transactions: [] }>(
        '/transactions/import',
        data,
      );
      if (Array.isArray(response.data.transactions)) {
        history.goBack();
      } else {
        throw new Error(
          `unexpected response data: ${JSON.stringify(response.data)}`,
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.response?.error || err.message);
    }
  }

  function submitFile(files: File[]): void {
    const fileProps: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));
    setUploadedFiles(fileProps);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button
              onClick={handleUpload}
              type="button"
              disabled={!uploadedFiles.length}
            >
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
