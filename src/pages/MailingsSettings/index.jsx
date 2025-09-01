import React, { useState } from 'react';

import ConnectModal from '../../components/ConnectModal';
import GeoBadge from '../../components/GeoBadge';
import CustomMainButton from '../../customs/CustomMainButton';
import { mockServices } from '../../mocks/mockServices';
import { Card, CardHeader, Container, Grid, Icon, Instruction, Text, Title } from './styles';

const MailingsSettings = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <Container>
      <GeoBadge title="Настройки рассылки" />

      <Grid>
        {mockServices.map((service) => (
          <Card key={service.id}>
            <div>
              <CardHeader>
                <Title>{service.name}</Title>
                {service.icon && <Icon src={service.icon} alt={service.name} />}
              </CardHeader>

              <Text>{service.description}</Text>

              {service.link && (
                <Instruction>
                  Инструкция:{' '}
                  <a href={service.link} target="_blank" rel="noreferrer">
                    {service.link}
                  </a>
                </Instruction>
              )}
            </div>

            <CustomMainButton onClick={() => setSelectedService(service)}>
              Подключить аккаунт
            </CustomMainButton>
          </Card>
        ))}
      </Grid>

      {selectedService && (
        <ConnectModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </Container>
  );
};

export default MailingsSettings;
