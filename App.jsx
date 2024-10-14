// App.jsx
import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import useDownloadWithRNFS from './hooks/useDownloadWithRNFS';
 // Adjust the path if necessary

const App = () => {
//   const simpleFetch = async () => {
//     const link = 'https://www.npci.org.in/PDF/nach/circular/2016-17/CircularNo154_ChangesinUID_response_file_for_New_Mapper_format.pdf';
//     const { dirs } = RNFetchBlob.fs;
//     const filePath = `${dirs.DownloadDir}/test.pdf`;

//     if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         );

//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             console.log('Storage permission denied');
//             return;
//         }
//     }

//     try {
//         const response = await RNFetchBlob.config({
//             fileCache: true,
//             path: filePath,
//         }).fetch('GET', link);
        
//         console.log('Downloaded to:', filePath);
//     } catch (error) {
//         console.log('Download error:', error);
//     }
// };
  // const [handleDownload] = useDownload();
  const [handleDownload] = useDownloadWithRNFS()
  const [downloadMessage, setDownloadMessage] = useState('');

  const downloadFile =async () => {
    // await simpleFetch();
    const link = 'https://asia-impact.s3.amazonaws.com/images%2Cdocument/punching-n-blending-application.pdf'; // Replace with your file link
    const attachmentName = 'sample.pdf'; // Name for the downloaded file
    const attachmentType = 'application/pdf'; // MIME type
    console.log('working with download');
    
    handleDownload(link, attachmentName, attachmentType).then((filePath) => {
      console.log(filePath,'filePath');
      
      // Set the message with the download location
      if(filePath){
        setDownloadMessage(`Downloaded to: ${filePath}`);
      }else{
        setDownloadMessage("error in downloading process")
      }
    }).catch(e=>console.log(e))
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Download File" onPress={downloadFile} />
      {downloadMessage ? (
        <Text style={{ marginTop: 20 }}>{downloadMessage}</Text>
      ) : null}
    </View>
  );
};

export default App;
