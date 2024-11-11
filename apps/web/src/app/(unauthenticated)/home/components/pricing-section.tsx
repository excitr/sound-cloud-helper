'use client';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { rem } from '@/theme';

export default function PricingSection(): React.JSX.Element {
  return (
    <Box display="flex" justifyContent="space-around" gap={3} mx={54}>
      {[
        { price: 9.99, duration: '1 month' },
        { price: 18.99, duration: '2 months' },
        { price: 26.99, duration: '3 months' },
      ].map((plan) => (
        <Card
          key={plan.price}
          sx={{
            backgroundColor: '#F5F5F5',
            padding: 6,
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <CardContent>
            <Typography color="#444" fontSize={rem(28.8)} fontWeight={700} variant="h6">
              ${plan.price}
            </Typography>
            <Typography color="#FF5732" fontSize={rem(16)} fontWeight={600} variant="body2">
              {plan.duration} of activity on one account
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                color: '#FF5732',
                borderRadius: 8,
                borderColor: '#FF5732',
                px: 6,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Buy
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
