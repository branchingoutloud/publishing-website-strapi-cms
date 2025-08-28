import type { Schema, Struct } from '@strapi/strapi';

export interface CommonFeatureName extends Struct.ComponentSchema {
  collectionName: 'components_common_feature_names';
  info: {
    displayName: 'featureName';
  };
  attributes: {};
}

export interface CommonFeatures extends Struct.ComponentSchema {
  collectionName: 'components_common_features';
  info: {
    displayName: 'features';
  };
  attributes: {
    featureDescription: Schema.Attribute.Text;
    featureId: Schema.Attribute.Integer;
    featureName: Schema.Attribute.String;
  };
}

export interface CommonReview extends Struct.ComponentSchema {
  collectionName: 'components_common_reviews';
  info: {
    displayName: 'review';
  };
  attributes: {
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      >;
    review: Schema.Attribute.Text;
    reviewCreatedAt: Schema.Attribute.Date;
    reviewerName: Schema.Attribute.String;
    reviewersCompany: Schema.Attribute.String;
    reviewersProfile: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.feature-name': CommonFeatureName;
      'common.features': CommonFeatures;
      'common.review': CommonReview;
    }
  }
}
