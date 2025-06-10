import {
  IconSun,
  IconCloud,
  IconCloudRain,
  IconCloudSnow,
  IconCloudFog,
  IconCloudBolt,
  IconWind,
  IconX,
} from '@tabler/icons-react';
import type { MatchSchema } from '../schemas/entities/match.entity';

export function getWeatherCondition(condition: MatchSchema['weatherCondition']) {
  switch (condition) {
    case 'SUNNY':
      return { label: 'Sunny', color: 'yellow', icon: IconSun };
    case 'CLOUDY':
      return { label: 'Cloudy', color: 'gray', icon: IconCloud };
    case 'RAINY':
      return { label: 'Rain', color: 'blue', icon: IconCloudRain };
    case 'SNOWY':
      return { label: 'Snow', color: 'white', icon: IconCloudSnow };
    case 'FOGGY':
      return { label: 'Fog', color: 'gray', icon: IconCloudFog };
    case 'WINDY':
      return { label: 'Windy', color: 'blue', icon: IconWind };
    case 'STORMY':
      return { label: 'Stormy', color: 'red', icon: IconCloudBolt };
    case 'OTHER':
      return { label: 'Other', color: 'gray', icon: IconCloud };
    default:
      return { label: 'No Weather Specified', color: 'gray', icon: IconX };
  }
}
