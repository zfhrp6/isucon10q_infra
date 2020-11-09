/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class Isucon10QInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'app-vpc');
    const appSg = new ec2.SecurityGroup(this, 'app-sg', {
      vpc,
    });
    appSg.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
    // Allow Ingress(ssh,http,https)
    [22, 80, 443].forEach((p) => {
      appSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(p));
    });

    const benchVpc = new ec2.Vpc(this, 'bench-vpc');
    new ec2.SecurityGroup(this, 'bench-sg', {
      vpc: benchVpc,
    });

    // 3 app machines
    const appInstances = Array(3).map(
      (i) => new ec2.Instance(this, `isu${i}`, {
        // c6g.medium(vCPU:1, Mem:2GiB, Storage:EBS only, Network:max10Gbps, EBS bandwidth:4750Mbs
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C6G, ec2.InstanceSize.MEDIUM),
        // Ubuntu 18.04
        machineImage: ec2.MachineImage.genericLinux({
          'ap-northeast-1': 'ami-09b86f9709b3c33d4',
        }),
        vpc,
      }),
    );
    // for (let i = 1; i < appInstances.length + 1; i += 1) {
    //   const ins = appInstances[i];
    //   new cdk.CfnOutput(this, `isu${i}-output`, {
    //     value: `PubIP: ${ins.instancePublicIp},
    // PrIP: ${ins.instancePrivateIp},
    // DNS name:${ins.instancePublicDnsName}`,
    //   });
    // }

    // 1 benchmark machine
    const benchInstance = new ec2.Instance(this, 'isu-bench', {
      // // r6g.medium(1vCPU, 8GiB)
      // instanceType: ec2.InstanceType.of(ec2.InstanceClass.r6g, ec2.InstanceSize.MEDIUM),
      // r6g.large(2vCPU, 16GiB)
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.LARGE),
      // Ubuntu 18.04
      machineImage: ec2.MachineImage.genericLinux({
        'ap-northeast-1': 'ami-09b86f9709b3c33d4',
      }),
      vpc: benchVpc,
    });
    //     new cdk.CfnOutput(this, benchInstance.instanceId, {
    //       value: `PubIP: ${benchInstance.instancePublicIp},
    // PrIP: ${benchInstance.instancePrivateIp},
    // DNS name:${benchInstance.instancePublicDnsName}`,
    //     });
  }
}
