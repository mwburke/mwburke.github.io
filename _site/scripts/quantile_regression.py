import pandas as pd
import numpy as np
import seaborn as sns
from statsmodels.regression.linear_model import OLS
import matplotlib
import matplotlib.pyplot as plt
from statsmodels.regression.quantile_regression import QuantReg
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score


max_iter = 3000

df = pd.read_csv('data/housing.csv')
target_col = 'MEDV'
value_cols = [c for c in df.columns if c != target_col]

# Print out housing median value histogram:
sns.distplot(df['MEDV'], axlabel='Median House Value')
plt.show()

basemod = OLS(exog=df[value_cols], endog=df[target_col]).fit()
mod = QuantReg(exog=df[value_cols], endog=df[target_col])
qmods = []


def fit_model(mod, q, max_iter):
    """dat
    For each model, train it on the quantile,
    create a new dataframe and populate it with
    the parameters values and the intercept value
    Then append to general quant_params dataframe
    """
    res = mod.fit(q=q, max_iter=max_iter)
    qmods.append(res)
    params = []
    coefs = []
    confs_low = []
    confs_high = []
    for param in res.params.index:
        params.append(param)
        coefs.append(res.params[param])
        confs_low.append(res.conf_int().loc[param][0])
        confs_high.append(res.conf_int().loc[param][1])
    return pd.DataFrame({
        'Quantile': q,
        'Factor': params,
        'Value': coefs,
        'UpperBound': confs_low,
        'LowerBound': confs_high
    })


quantiles = np.arange(0.05, 1, .05)
quantile_cutoffs = quantiles + 0.025
quantile_cutoffs[18] = 1
quantile_cutoff_values = np.array([np.percentile(df[target_col], q * 100) for q in quantile_cutoffs])
data = pd.DataFrame(columns=['Quantile', 'Factor' 'Value', 'UpperBound', 'LowerBound'])

for q in quantiles:
    data = pd.concat([data, fit_model(mod, q, max_iter)], sort=False)

if 'FactorValue' in data.columns:
    data.drop(columns=['FactorValue'], inplace=True)


def quantile_model_num(cutoffs, x):
    if x <= cutoffs[0]:
        return 0
    return np.max(np.where(cutoffs <= x))


df['model_num'] = df[target_col].apply(lambda x: quantile_model_num(quantile_cutoff_values, x))


base_preds = np.array(basemod.predict(df[value_cols]))
quant_preds = np.array(np.zeros(df.shape[0]))

for i in range(df.shape[0]):
    quant_preds[i] = qmods[int(df.iloc[i]['model_num'])].predict(np.array(df.iloc[i][value_cols]))

predictions = pd.DataFrame({'actual': df[target_col], 'base': base_preds, 'quant': quant_preds})
predictions = predictions.sort_values('actual').reset_index()
predictions.drop(columns=['index'], inplace=True)

def calc_metrics(y_true, y_preds):
    print('MAE: {}'.format(np.round(mean_absolute_error(y_true, y_preds), 3)))
    print('MSE: {}'.format(np.round(mean_squared_error(y_true, y_preds), 3)))
    print('R2: {}'.format(np.round(r2_score(y_true, y_preds), 3)))


print()
print('Base metrics:')
calc_metrics(predictions.actual, predictions.base)

print()
print('Quant metrics:')
calc_metrics(predictions.actual, predictions.quant)


# plt.figure(figsize=(5, 5))
plt.scatter(predictions.index, predictions.base, alpha=0.3)
plt.scatter(predictions.index, predictions.quant, alpha=0.3)
plt.scatter(predictions.index, predictions.actual)
plt.ylabel('Median house price')
plt.legend()
plt.show()


plt.figure(figsize=(7, 7))
for i, col_name in enumerate(value_cols):
    row = i % 5
    col = i // 5
    plt.subplot(5, 3, i + 1)
    plt.plot(data[data['Factor'] == col_name]['Quantile'], data[data['Factor'] == col_name]['Value'])
    plt.axhline(basemod.params[col_name], color="red")
    plt.title(col_name)
    plt.xlabel('Quantile')
    plt.ylabel('Slope')
plt.tight_layout()
plt.show()
