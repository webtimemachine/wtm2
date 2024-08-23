import { Metadata } from 'next';
import { Footer } from '../components/footer';
import { Heading, Link, Stack, Text } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'WebTM | Privacy Policies',
  description:
    'WebTM extension privacy policy. Learn how we collect, use, and share your personal information.',
};

export default function PrivacyPoliciesPage() {
  return (
    <Stack justifyContent={'center'} spacing={4}>
      <Heading as='h1' size={'xl'} fontWeight={'semibold'}>
        WebTM Extension Privacy Policy
      </Heading>
      <Text as='p'>
        This privacy policy describes how WebTM Extension{' '}
        {`("we", "our" or "the
          extension") `}
        collects, uses, and shares the personal information of users ({'"you"'}{' '}
        or {'"your"'}) in connection with the use of our extension in Google
        Chrome and Safari browsers on iOS devices.
      </Text>
      <Text as='p'>
        <Text as='strong'>1. Collection and use of information</Text>
      </Text>
      <Text as='p'>
        The WebTM extension primarily aims to allow users to sync their browsing
        history between Google Chrome and Safari browsers. To achieve this, the
        extension saves information about the web pages visited by the user and
        keeps this history synchronized between both browsers. This information
        includes the date of visit, URL, title, and content of web pages.
      </Text>
      <Text as='p'>
        The extension only collects personal information when the user logs into
        the extension by providing their email address. This information is used
        solely to identify the user and associate their browsing history with
        their account.
      </Text>
      <Text as='p'>
        <Text as='strong'>2. Use of information</Text>
      </Text>
      <Text as='p'>
        All information collected by the extension is used solely to provide and
        improve browsing history synchronization services between Google Chrome
        and Safari browsers. The {"user's"} personal information is not shared
        with third parties and is only accessible by the user.
      </Text>
      <Text as='p'>
        <Text as='strong'>3. Cookies and tracking technologies</Text>
      </Text>
      <Text as='p'>
        The WebTM extension does not use cookies or other tracking technologies
        to collect information about users.
      </Text>
      <Text as='p'>
        <Text as='strong'>4. Information Protection</Text>
      </Text>
      <Text as='p'>
        We value the privacy and security of our {"users'"} information.
        Therefore, we implement security measures to protect personal
        information collected by the extension.
      </Text>
      <Text as='p'>
        <Text as='strong'>5. User rights</Text>
      </Text>
      <Text as='p'>
        Users have the right to access, rectify, and delete their personal
        information stored by the extension. They can do this by deleting logs
        of their browsing history through the {"extension's"} user interface.
      </Text>
      <Text as='p'>
        <Text as='strong'>6. Contact</Text>
      </Text>
      <Text as='p'>
        If you have any questions or concerns about our privacy policy or your
        use of the WebTM extension, you can contact us through the{' '}
        {"extension's"}{' '}
        <Link
          href='https://github.com/webtimemachine/wtm2'
          target='_blank'
          rel='noreferrer'
          color='blue.500'
        >
          GitHub repository
        </Link>
        .
      </Text>
    </Stack>
  );
}
