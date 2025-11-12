/**
 * Paywall Screen
 * Displays subscription options and handles purchases
 *
 * @screen PaywallScreen
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@types';
import {Screen, Text, Button, Card} from '@components';
import {colors, spacing, radii, typography} from '@theme';
import {revenueCatService} from '@services';
import {useSubscriptionStore} from '@store';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  pricePerWeek: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
  package: any;
}

export const PaywallScreen: React.FC<Props> = ({route, navigation}) => {
  const {source} = route.params;
  const {refreshSubscription} = useSubscriptionStore();

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('annual');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  // Validate selectedPlan when plans change
  useEffect(() => {
    if (plans.length > 0) {
      const isValidSelection = plans.some(p => p.id === selectedPlan);
      if (!isValidSelection) {
        // Select the popular plan, or fall back to the first plan
        const popularPlan = plans.find(p => p.isPopular);
        setSelectedPlan(popularPlan?.id || plans[0].id);
      }
    }
  }, [plans]);

  const loadOfferings = async () => {
    setLoading(true);
    try {
      const offerings = await revenueCatService.getOfferings();

      if (offerings?.availablePackages) {
        const pricingPlans: PricingPlan[] = offerings.availablePackages.map((pkg: any) => {
          const isWeekly = pkg.identifier === 'weekly';
          const weeklyPrice = isWeekly ? pkg.product.price : pkg.product.price / 52;

          return {
            id: pkg.identifier,
            name: isWeekly ? 'Weekly' : 'Annual',
            price: pkg.product.priceString,
            pricePerWeek: `$${weeklyPrice.toFixed(2)}/week`,
            period: isWeekly ? 'Billed weekly' : 'Billed annually',
            savings: isWeekly ? undefined : 'Save 83%',
            isPopular: !isWeekly,
            package: pkg,
          };
        });

        setPlans(pricingPlans);
      }
    } catch (error) {
      console.error('Error loading offerings:', error);
      Alert.alert('Error', 'Failed to load subscription options');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = useCallback(async () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    setPurchasing(true);
    try {
      const {customerInfo} = await revenueCatService.purchasePackage(plan.package);

      // Check if purchase was successful
      if (customerInfo?.entitlements?.active?.premium) {
        await refreshSubscription();
        navigation.goBack();
        Alert.alert(
          'Welcome to Premium!',
          'You now have access to all premium features.',
        );
      }
    } catch (error: any) {
      console.error('Error purchasing:', error);
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', 'Please try again or contact support.');
      }
    } finally {
      setPurchasing(false);
    }
  }, [selectedPlan, plans, refreshSubscription, navigation]);

  const handleRestore = useCallback(async () => {
    setPurchasing(true);
    try {
      const customerInfo = await revenueCatService.restorePurchases();

      if (customerInfo?.entitlements?.active?.premium) {
        await refreshSubscription();
        navigation.goBack();
        Alert.alert('Success', 'Your purchases have been restored.');
      } else {
        Alert.alert('No Purchases Found', 'No active subscriptions to restore.');
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('Error', 'Failed to restore purchases');
    } finally {
      setPurchasing(false);
    }
  }, [refreshSubscription, navigation]);

  const renderPlan = (plan: PricingPlan) => {
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        key={plan.id}
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={() => setSelectedPlan(plan.id)}
        activeOpacity={0.8}>
        {plan.isPopular && (
          <View style={styles.popularBadge}>
            <Text variant="caption" style={styles.popularText}>
              BEST VALUE
            </Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <Text variant="headline" color={colors.textPrimary}>
              {plan.name}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              {plan.period}
            </Text>
          </View>

          <View style={styles.planPricing}>
            <Text variant="display2" color={colors.accent}>
              {plan.price}
            </Text>
            {plan.savings && (
              <View style={styles.savingsBadge}>
                <Text variant="caption" style={styles.savingsText}>
                  {plan.savings}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text variant="bodySm" color={colors.textSecondary} style={styles.pricePerWeek}>
          Only {plan.pricePerWeek}
        </Text>

        <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeature = (text: string) => (
    <View key={text} style={styles.feature}>
      <Text variant="body" color={colors.success}>
        ✓
      </Text>
      <Text variant="body" style={styles.featureText}>
        {text}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading subscription options...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text variant="headline" color={colors.textPrimary}>
              ✕
            </Text>
          </TouchableOpacity>

          <Text variant="display2" style={styles.title}>
            Unlock Your Full
          </Text>
          <Text variant="display2" style={styles.title} color={colors.accent}>
            Spiritual Journey
          </Text>
          <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Transform your screen time into prayer time with Premium
          </Text>
        </View>

        {/* Features */}
        <Card style={styles.featuresCard}>
          <Text variant="headline" style={styles.featuresTitle}>
            Premium Features
          </Text>
          {renderFeature('Block unlimited apps')}
          {renderFeature('Full verse library (500+ verses)')}
          {renderFeature('Custom prayers & content')}
          {renderFeature('Advanced scheduling')}
          {renderFeature('Detailed analytics & insights')}
          {renderFeature('No ads')}
          {renderFeature('Cloud sync across devices')}
          {renderFeature('Priority support')}
        </Card>

        {/* Pricing Plans */}
        <View style={styles.plansContainer}>
          <Text variant="headline" style={styles.plansTitle}>
            Choose Your Plan
          </Text>
          {plans.map(renderPlan)}
        </View>

        {/* CTA Button */}
        <Button
          title={purchasing ? 'Processing...' : 'Start Premium'}
          variant="cta"
          onPress={handlePurchase}
          disabled={purchasing}
          loading={purchasing}
          style={styles.ctaButton}
        />

        {/* Restore purchases */}
        <TouchableOpacity onPress={handleRestore} disabled={purchasing}>
          <Text variant="bodySm" color={colors.accent} style={styles.restoreText}>
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.terms}>
          <Text variant="caption" color={colors.textMuted} style={styles.termsText}>
            Subscription automatically renews unless cancelled at least 24 hours before the end of
            the current period.
          </Text>
          <View style={styles.links}>
            <TouchableOpacity>
              <Text variant="caption" color={colors.accent}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text variant="caption" color={colors.textMuted}>
              {' • '}
            </Text>
            <TouchableOpacity>
              <Text variant="caption" color={colors.accent}>
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    padding: 0,
  },
  content: {
    padding: spacing.screenPadding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.scale[4],
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: spacing.scale[8],
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.scale[2],
    marginBottom: spacing.scale[4],
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.scale[4],
  },
  featuresCard: {
    marginBottom: spacing.scale[8],
  },
  featuresTitle: {
    marginBottom: spacing.scale[5],
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.scale[3],
  },
  featureText: {
    marginLeft: spacing.scale[3],
    flex: 1,
  },
  plansContainer: {
    marginBottom: spacing.scale[8],
  },
  plansTitle: {
    marginBottom: spacing.scale[5],
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    padding: spacing.scale[5],
    marginBottom: spacing.scale[4],
    borderWidth: 2,
    borderColor: colors.outline,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '10',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.scale[4],
    paddingVertical: spacing.scale[2],
    borderRadius: radii.pill,
  },
  popularText: {
    color: colors.background,
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.scale[3],
  },
  planInfo: {
    flex: 1,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  savingsBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.scale[2],
    paddingVertical: spacing.scale[1],
    borderRadius: radii.xs,
    marginTop: spacing.scale[1],
  },
  savingsText: {
    color: colors.success,
    fontWeight: '600',
  },
  pricePerWeek: {
    marginBottom: spacing.scale[4],
  },
  radioButton: {
    position: 'absolute',
    right: spacing.scale[5],
    bottom: spacing.scale[5],
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.accent,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  ctaButton: {
    marginBottom: spacing.scale[4],
  },
  restoreText: {
    textAlign: 'center',
    marginBottom: spacing.scale[8],
  },
  terms: {
    alignItems: 'center',
  },
  termsText: {
    textAlign: 'center',
    marginBottom: spacing.scale[3],
    lineHeight: 18,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
