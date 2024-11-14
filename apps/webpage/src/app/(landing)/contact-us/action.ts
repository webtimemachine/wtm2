'use server';

const colorsByQueryType = {
  'Technical Support': 0x00ff00,
  'Delete Account Request': 0xff0000,
  Other: 0x0000ff,
};

export const sendMessageToDiscord = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());

  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL as string;
  const queryType = data['query-type'] as keyof typeof colorsByQueryType;

  const discordEmbed = {
    embeds: [
      {
        title: `Contact Us Form Submission`,
        color: colorsByQueryType[queryType] || 0x000000,
        fields: [
          {
            name: 'Name',
            value: data.name,
          },
          {
            name: 'Email',
            value: data.email,
          },
          {
            name: 'Query Type',
            value: queryType,
          },
          {
            name: 'Subject',
            value: data.subject,
          },
          {
            name: 'Message',
            value: data.message,
          },
        ],
      },
    ],
  };

  try {
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordEmbed),
    });
  } catch (error) {
    console.error('Error sending message to Discord', error);
  }
};
