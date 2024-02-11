/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { InfoCard } from '../InfoCard/InfoCard';
import { GridItem } from './styles';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { ProxiedSignInIdentity } from '../ProxiedSignInPage/ProxiedSignInIdentity';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';

const Component: ProviderComponent = ({ onSignInStarted, onSignInSuccess }) => {
  const discoveryApi = useApi(discoveryApiRef);
  return (
    <GridItem>
      <InfoCard
        title="Guest"
        variant="fullHeight"
        actions={
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              onSignInStarted();
              onSignInSuccess(
                new ProxiedSignInIdentity({
                  provider: 'guest',
                  discoveryApi,
                }),
              );
            }}
          >
            Enter
          </Button>
        }
      >
        <Typography variant="body1">Sign in as a Guest.</Typography>
      </InfoCard>
    </GridItem>
  );
};

const loader: ProviderLoader = async apis => {
  const identity = new ProxiedSignInIdentity({
    provider: 'guest',
    discoveryApi: apis.get(discoveryApiRef)!,
  });

  await identity.start();

  const identityResponse = await identity.getBackstageIdentity();

  if (!identityResponse) {
    return undefined;
  }

  return identity;
};

export const guestProvider: SignInProvider = { Component, loader };
