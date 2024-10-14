import { useCallback } from 'react';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform, Linking } from 'react-native';

const useDownloadWithRNFS = () => {
  const handleDownload = useCallback(async (link, attachmentName) => {
    const uniqueFileName = `${attachmentName}_${new Date().getTime()}.pdf`; // Ensure PDF extension
    const filePath = `${RNFS.DownloadDirectoryPath}/${uniqueFileName}`;

    console.log('Starting download...');

    // Request permissions
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log('Storage permission denied');
      return;
    }

    try {
      console.log('Starting file download...');

      const response = await RNFS.downloadFile({
        fromUrl: link,
        toFile: filePath,
        background: true,
        progress: (res) => {
          const percentage = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${Math.floor(percentage)}%`);
        },
      }).promise;

      console.log('Download response status:', response.statusCode);
      if (response.statusCode === 200) {
        console.log('File downloaded successfully to:', filePath);
        Linking.openURL(`file://${filePath}`).catch((err) => console.log('Error opening file:', err));
        return filePath;
      } else {
        console.log('Download failed with status:', response.statusCode);
      }
    } catch (error) {
      console.log('Download error:', error);
    }
  }, []);

  return [handleDownload];
};

const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
  
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // Permissions are automatically granted on Android 13+
  };
  

export default useDownloadWithRNFS;
