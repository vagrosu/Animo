using System.Security.Cryptography;
using System.Text;

namespace Animo.Application;

public static class CryptoHelper
{
    public static string DecryptTextMessage(string encryptedMessage, string keyString, string iv)
    {
        byte[] cipherTextBytes = Convert.FromBase64String(encryptedMessage);
        byte[] keyBytes = Encoding.UTF8.GetBytes(keyString);
        byte[] ivBytes = Encoding.UTF8.GetBytes(iv);

        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = keyBytes;
            aesAlg.IV = ivBytes;
            aesAlg.Mode = CipherMode.CBC;
            aesAlg.Padding = PaddingMode.PKCS7;

            ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
            using (MemoryStream msDecrypt = new MemoryStream(cipherTextBytes))
            {
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        return srDecrypt.ReadToEnd();
                    }
                }
            }
        }
    }
}
